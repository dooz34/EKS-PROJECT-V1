# EKS Project — Secure Cloud-Native App on Amazon EKS

Deploys a containerized app to Amazon EKS with GitOps (ArgoCD), automatic
HTTPS (NGINX Ingress + CertManager), dynamic DNS (ExternalDNS + Route 53),
and monitoring (Prometheus + Grafana).

Target endpoint: `https://eks.<domain>` (domain TBD — see Status below)

## Status

- [x] Terraform: VPC (public/private subnets across 2 AZs)
- [x] Terraform: EKS cluster + managed node group (private subnets)
- [x] Terraform: IAM roles for cluster, nodes, and IRSA (ExternalDNS, CertManager)
- [x] Terraform: ECR repository, Route 53 zone lookup
- [ ] Register domain in Route 53
- [ ] NGINX Ingress Controller
- [ ] CertManager (Let's Encrypt via Route 53 DNS-01)
- [ ] ExternalDNS
- [ ] CI/CD Pipeline 1: Terraform (Checkov, plan/apply)
- [ ] CI/CD Pipeline 2: Docker build, Trivy scan, push to ECR, deploy
- [ ] ArgoCD GitOps
- [ ] Prometheus + Grafana
- [ ] Architecture diagram

## Repo structure
terraform/
modules/
vpc/ # VPC, public+private subnets, NAT, routing
eks/ # EKS cluster, node group, IAM roles, OIDC provider (for IRSA)
irsa/ # Reusable module: IAM role assumable by a specific k8s service account
environments/
prod/ # Wires the modules together, remote state backend
k8s/
base/ # Kubernetes manifests (ingress, certmanager, externaldns) — next phase
argocd/ # ArgoCD Application manifests — next phase
.github/
workflows/ # CI/CD pipelines — next phase
docs/
bootstrap-backend.md # One-time setup for Terraform remote state

## Getting started

1. **Register a domain in Route 53** and update `domain_name` in
   `terraform/environments/prod/variables.tf` — currently a placeholder.
2. **Bootstrap remote state** — see `docs/bootstrap-backend.md`. Do this once,
   manually, before `terraform init`.
3. **Review variables** in `terraform/environments/prod/variables.tf`
   (region, AZs, CIDR ranges, cluster name).
4. **Deploy**:
```bash
   cd terraform/environments/prod
   terraform init
   terraform plan
   terraform apply
```
5. **Configure kubectl**:
```bash
   aws eks update-kubeconfig --name eks-yonis-prod --region eu-west-2
```

## Notes on IAM / IRSA

`ExternalDNS` and `CertManager` don't use static AWS access keys. Each gets a
dedicated IAM role, scoped only to the specific Route 53 hosted zone, that can
only be assumed by its matching Kubernetes service account (via the EKS OIDC
provider). This follows the same "no static credentials, least privilege"
principle as OIDC-based auth in GitHub Actions.

Worker nodes run in **private subnets only**; the public subnets exist purely
for the internet gateway / load balancer, as required by the brief.