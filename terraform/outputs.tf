output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_name" {
  description = "Set as EKS_CLUSTER_NAME GitHub variable"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "secrets_manager_arn" {
  description = "Reference in External Secrets SecretStore"
  value       = aws_secretsmanager_secret.app.arn
}
