variable "aws_region" {
  type    = string
  default = "eu-west-2"
}

variable "project_name" {
  type    = string
  default = "eks-yonis"
}

variable "cluster_name" {
  type    = string
  default = "eks-yonis-prod"
}

variable "domain_name" {
  description = "Root domain in Route 53 for this project"
  type        = string
  default     = "eks.k8-yonis.dev"
}

variable "azs" {
  type    = list(string)
  default = ["eu-west-2a", "eu-west-2b"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}