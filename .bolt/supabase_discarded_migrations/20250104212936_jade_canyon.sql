/*
  # Users and Roles Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Firebase Auth UID
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (text) - Account status (active/inactive)
    
    - `roles`
      - `id` (text, primary key) - Role identifier (admin, document_manager, etc)
      - `name` (text) - Display name
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_roles`
      - `user_id` (uuid, references users.id)
      - `role_id` (text, references roles.id)
      - `assigned_at` (timestamp)
      - Primary key is (user_id, role_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user self-access

  3. Functions
    - get_user_roles(user_id uuid) - Returns all roles for a user
    - assign_role(user_id uuid, role_id text) - Assigns a role to a user
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id text REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create policies for roles table
CREATE POLICY "Anyone can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create policies for user_roles table
CREATE POLICY "Users can read own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = 'admin'
    )
  );

-- Create function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id uuid)
RETURNS TABLE (
  role_id text,
  role_name text,
  role_description text
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description
  FROM roles r
  JOIN user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to assign role
CREATE OR REPLACE FUNCTION assign_role(p_user_id uuid, p_role_id text)
RETURNS void AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_id)
  VALUES (p_user_id, p_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default roles
INSERT INTO roles (id, name, description)
VALUES
  ('admin', 'Administrator', 'Full system access'),
  ('document_manager', 'Document Manager', 'Can manage all document operations'),
  ('document_viewer', 'Document Viewer', 'Can only view documents')
ON CONFLICT (id) DO NOTHING;