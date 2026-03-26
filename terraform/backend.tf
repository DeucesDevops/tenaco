terraform {
  required_version = ">= 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — create the S3 bucket and DynamoDB table once, then uncomment.
  # aws s3 mb s3://tenaco-tf-state --region us-east-1
  # aws dynamodb create-table \
  #   --table-name tenaco-tf-locks \
  #   --attribute-definitions AttributeName=LockID,AttributeType=S \
  #   --key-schema AttributeName=LockID,KeyType=HASH \
  #   --billing-mode PAY_PER_REQUEST
  backend "s3" {
    bucket         = "tenaco-tf-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tenaco-tf-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}
