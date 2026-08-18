# Remote state backend.
#
# S3 buckets and DynamoDB tables can't be created by the same config that
# uses them as a backend. Create these two resources ONCE first — see
# docs/bootstrap-backend.md — before running `terraform init` here.
#
# terraform {
#   backend "s3" {
#     bucket         = "eks-yonis-tfstate"      # <-- replace with your bucket name
#     key            = "eks-project/prod/terraform.tfstate"
#     region         = "eu-west-2"
#     dynamodb_table = "eks-yonis-tf-locks"     # <-- replace with your table name
#     encrypt        = true
#   }
# }
#
# Uncomment the block above with your real names once the backend resources
# exist, then run: terraform init -migrate-state

terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}