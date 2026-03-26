# Tenaco uses Neon (cloud-managed PostgreSQL) — no RDS module needed.
# Only VPC and EKS are required as AWS infrastructure.

locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "vpc" {
  source = "./modules/vpc"

  project     = var.project
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  tags        = local.common_tags
}

module "eks" {
  source = "./modules/eks"

  project            = var.project
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  node_instance_type = var.eks_node_instance_type
  desired_nodes      = var.eks_desired_nodes
  min_nodes          = var.eks_min_nodes
  max_nodes          = var.eks_max_nodes
  tags               = local.common_tags
}

# Store app secrets in Secrets Manager for External Secrets Operator to pull.
resource "aws_secretsmanager_secret" "app" {
  name                    = "${var.project}/production"
  description             = "Runtime secrets for ${var.project}"
  recovery_window_in_days = 7
  tags                    = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  # Fill in real values — DATABASE_URL points to your Neon connection string.
  secret_string = jsonencode({
    DATABASE_URL           = "jdbc:postgresql://NEON_HOST/tenaco?sslmode=require"
    DB_USERNAME            = "REPLACE_ME"
    DB_PASSWORD            = "REPLACE_ME"
    JWT_SECRET             = "REPLACE_WITH_STRONG_SECRET"
    CORS_ALLOWED_ORIGINS   = "https://tenaco.yourdomain.com"
    MAIL_USERNAME          = "REPLACE_ME"
    MAIL_PASSWORD          = "REPLACE_ME"
  })
}
