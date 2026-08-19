terraform {
  required_version = ">= 1.6"

  backend "s3" {
    bucket         = "eks-yonis-tfstate"
    key            = "eks-project/prod/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "eks-yonis-tf-locks"
    encrypt        = true
  }

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