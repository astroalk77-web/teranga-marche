# TERANGA MARCHÉ

### Une plateforme numérique pour valoriser les produits agricoles locaux au Sénégal.

Teranga Marché est une plateforme web qui facilite la mise en relation entre les producteurs agricoles et les acheteurs. Elle permet de présenter les produits disponibles, de consulter les annonces et de contacter directement les producteurs.

---

## 1. Fonctionnalités

### Interface d'accueil
- Présentation de la plateforme.
- Choix du profil : acheteur ou producteur.
- Redirection vers l'interface correspondante.

### Espace acheteur
- Consultation du catalogue des produits agricoles.
- Recherche de produits par nom.
- Filtrage par catégorie et région.
- Affichage des prix, quantités et informations des producteurs.
- Consultation des photos des produits.
- Contact direct avec les producteurs via WhatsApp.

### Espace producteur
- Formulaire de publication des annonces.
- Ajout des informations du produit.
- Ajout d'une image.
- Gestion et suppression des annonces.

---

## 2. Technologies utilisées

### Frontend
- HTML5 : structure des pages.
- CSS3 : mise en forme et responsive design.
- JavaScript : interactions et logique de l'application.

### Backend
- Python
- Django
- Django REST Framework
- MySQL
- JWT : authentification par jetons.

---

## 3. Structure du frontend

```text
Teranga_Marche_connecte/
│
├── index.html
├── acheteur.html
├── producteur.html
├── style.css
├── script.js
└── README.md
```

---

## 4. Installation et lancement

### Prérequis
- Visual Studio Code.
- Extension Live Server.
- Python et Django pour le backend.
- MySQL Server.

### Lancer le frontend

1. Ouvrir le dossier `Teranga_Marche_connecte` dans VS Code.
2. Ouvrir `index.html`.
3. Cliquer sur **Open with Live Server**.
4. Choisir son profil : Acheteur ou Producteur.

### Lancer le backend

Le serveur Django doit être démarré séparément.

Depuis le dossier backend, exécuter :

```bash
python manage.py runserver
```

L'API est accessible à l'adresse :

```text
http://127.0.0.1:8000/api/
```

Le frontend utilise actuellement cette adresse pour récupérer les produits.

---

## 5. État actuel du développement

| Fonctionnalité | État |
|---|---|
| Interface d'accueil | Disponible |
| Interface acheteur | Disponible |
| Catalogue connecté à l'API Django | Opérationnel |
| Recherche et filtres | Opérationnels |
| Affichage des images | Opérationnel |
| Contact WhatsApp | Opérationnel |
| Backend Django | Configuré |
| Base de données MySQL | Configurée |
| Authentification JWT | Configurée |
| Publication depuis l'interface producteur | À connecter |
| Gestion des annonces depuis l'interface producteur | À connecter |

**Important :** l'interface acheteur récupère les annonces depuis le backend Django. En revanche, l'interface producteur utilise encore le stockage local du navigateur pour ses opérations. Sa connexion à l'API et à la base de données reste à finaliser.

---

## 6. Objectif du projet

L'objectif de Teranga Marché est de faciliter la commercialisation des produits agricoles au Sénégal en offrant aux producteurs une meilleure visibilité et aux acheteurs un accès simplifié aux produits disponibles.

À terme, la plateforme ambitionne de devenir un espace numérique de référence pour les échanges entre producteurs et acheteurs agricoles.

---

**Projet :** Teranga Marché  
**Version :** Frontend connecté au backend  
**Statut :** En cours de développement
