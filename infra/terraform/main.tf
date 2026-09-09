locals {
  labels = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Ce fichier reste volontairement sans provider cloud : AWS, Scaleway, GCP et
# Hetzner n'ont ni les mêmes ressources ni le même modèle de facturation. Le
# chapitre demande à l'apprenant de choisir un provider, puis de brancher son
# module sous infra/terraform/provider/.

output "labels" {
  description = "Jeu d'étiquettes à transmettre aux ressources du provider."
  value       = local.labels
}

output "region" {
  description = "Région sélectionnée pour le prochain module provider."
  value       = var.region
}
