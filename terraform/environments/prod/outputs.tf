output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "external_dns_role_arn" {
  value = module.irsa_external_dns.role_arn
}

output "cert_manager_role_arn" {
  value = module.irsa_cert_manager.role_arn
}

output "hosted_zone_id" {
  value = data.aws_route53_zone.this.zone_id
}

output "vpc_id" {
  value = module.vpc.vpc_id
}