variable "role_name" {
  type = string
}

variable "oidc_provider_arn" {
  description = "ARN of the EKS cluster's OIDC provider"
  type        = string
}

variable "oidc_provider_url" {
  description = "OIDC provider URL without the https:// prefix"
  type        = string
}

variable "namespace" {
  description = "Kubernetes namespace of the service account"
  type        = string
}

variable "service_account_name" {
  description = "Name of the Kubernetes service account allowed to assume this role"
  type        = string
}

variable "policy_json" {
  description = "IAM policy document (JSON string) to attach to the role"
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}