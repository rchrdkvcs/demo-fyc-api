variable "project_name" {
  description = "Nom logique du projet utilisé dans les ressources du fournisseur."
  type        = string
  default     = "demo-fyc-api"
}

variable "environment" {
  description = "Environnement visé par le plan Terraform/OpenTofu."
  type        = string

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment doit être staging ou production."
  }
}

variable "region" {
  description = "Région du fournisseur, à utiliser dans le module provider choisi."
  type        = string
  default     = "CHANGE_ME"
}
