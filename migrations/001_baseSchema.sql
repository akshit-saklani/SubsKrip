-- ===========================
-- ORGANIZATIONS
-- ===========================
CREATE TABLE organizations (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   api_key VARCHAR(64) UNIQUE NOT NULL, -- for org-level API access
   active_flag TINYINT(1) DEFAULT 1,    -- soft delete
   created_by BIGINT NOT NULL,          -- user who created org
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ===========================
-- USERS
-- ===========================
CREATE TABLE users (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   organization_id BIGINT NOT NULL,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   role ENUM('admin', 'manager', 'finance', 'viewer') DEFAULT 'viewer',
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);


-- ===========================
-- CUSTOMERS (can be person OR organization)
-- ===========================
CREATE TABLE customers (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   organization_id BIGINT NOT NULL,   -- which org owns this customer
   customer_type ENUM('individual', 'organization') NOT NULL,
   name VARCHAR(255) NOT NULL,
   email VARCHAR(255),
   phone VARCHAR(20),
   org_customer_id BIGINT DEFAULT NULL, -- link to another organization if B2B
   status ENUM('active', 'inactive') DEFAULT 'active',
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
   FOREIGN KEY (org_customer_id) REFERENCES organizations(id) ON DELETE SET NULL
);


-- ===========================
-- PLANS
-- ===========================
CREATE TABLE plans (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   organization_id BIGINT NOT NULL,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   price DECIMAL(10,2) NOT NULL,
   billing_cycle ENUM('monthly', 'yearly', 'custom') NOT NULL,
   trial_days INT DEFAULT 0,
   currency VARCHAR(10) DEFAULT 'USD',
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);


-- ===========================
-- SUBSCRIPTIONS
-- ===========================
CREATE TABLE subscriptions (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   customer_id BIGINT NOT NULL,
   plan_id BIGINT NOT NULL,
   start_date DATE NOT NULL,
   end_date DATE,
   status ENUM('active', 'canceled', 'expired', 'trialing', 'past_due') DEFAULT 'active',
   auto_renew BOOLEAN DEFAULT TRUE,
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
   FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);


-- ===========================
-- BILLINGS (invoices)
-- ===========================
CREATE TABLE billings (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   subscription_id BIGINT NOT NULL,
   invoice_number VARCHAR(100) UNIQUE NOT NULL,
   amount DECIMAL(10,2) NOT NULL,
   currency VARCHAR(10) DEFAULT 'USD',
   status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
   due_date DATE,
   paid_at TIMESTAMP NULL,
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
);


-- ===========================
-- PAYMENTS (gateway transactions)
-- ===========================
CREATE TABLE payments (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   billing_id BIGINT NOT NULL,
   transaction_id VARCHAR(255) UNIQUE NOT NULL,
   gateway VARCHAR(50) NOT NULL,  -- e.g., Stripe, Razorpay
   amount DECIMAL(10,2) NOT NULL,
   currency VARCHAR(10) DEFAULT 'USD',
   status ENUM('initiated', 'success', 'failed', 'refunded') DEFAULT 'initiated',
   response TEXT,
   active_flag TINYINT(1) DEFAULT 1,
   created_by BIGINT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (billing_id) REFERENCES billings(id) ON DELETE CASCADE
);
