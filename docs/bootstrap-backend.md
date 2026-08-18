# Bootstrapping the Terraform Remote State Backend

Terraform can't create the S3 bucket / DynamoDB table it's about to use as its
own backend in the same apply. Create these once, manually, before running
`terraform init` in `terraform/environments/prod`.

```bash
aws s3api create-bucket \
  --bucket eks-yonis-tfstate \
  --region eu-west-2 \
  --create-bucket-configuration LocationConstraint=eu-west-2

aws s3api put-bucket-versioning \
  --bucket eks-yonis-tfstate \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket eks-yonis-tfstate \
  --server-side-encryption-configuration '{
    "Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]
  }'

aws dynamodb create-table \
  --table-name eks-yonis-tf-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-west-2
```

Then uncomment the `backend "s3" {}` block in
`terraform/environments/prod/backend.tf`, update the bucket/table names if you
changed them, and run:

```bash
cd terraform/environments/prod
terraform init -migrate-state
```