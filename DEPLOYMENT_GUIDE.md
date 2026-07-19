# Guide de Déploiement Bubble Hockey - Railway + Supabase

## Vue d'ensemble

Ce guide vous montre comment déployer le site Bubble Hockey sur Railway avec une base de données Supabase.

**Coûts estimés :**
- Supabase : $0-25/mois
- Railway : $0-20/mois (gratuit pour petit trafic)
- SendGrid : Gratuit (100 emails/jour)
- **Total : $0-45/mois**

---

## Étape 1 : Créer une base de données Supabase

1. Allez sur https://supabase.com
2. Cliquez "Start your project"
3. Créez un compte (email/password)
4. Créez un nouveau projet
5. Attendez que le projet soit prêt (2-3 minutes)
6. Allez dans "Settings" > "Database"
7. Copiez la **Connection String** (URI format)
8. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

**Exemple :**
```
postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres
```

---

## Étape 2 : Configurer SendGrid pour les emails

1. Allez sur https://sendgrid.com
2. Créez un compte (gratuit)
3. Allez dans "Settings" > "API Keys"
4. Créez une nouvelle API key
5. Copiez la clé (vous en aurez besoin)

---

## Étape 3 : Préparer le code pour Railway

Le code est déjà prêt ! Il contient :
- ✅ Dockerfile
- ✅ Base de données configurée
- ✅ Emails automatiques
- ✅ Tâches planifiées

---

## Étape 4 : Créer un compte Railway et déployer

1. Allez sur https://railway.app
2. Cliquez "Start a New Project"
3. Connectez-vous avec GitHub
4. Autorisez Railway à accéder à votre compte
5. Sélectionnez "Deploy from GitHub"
6. Cherchez le repo `bubblehockey-summer-qualifiers`
7. Cliquez "Deploy"

Railway va :
- Cloner votre repo
- Lire le Dockerfile
- Compiler l'application
- La lancer sur ses serveurs

---

## Étape 5 : Configurer les variables d'environnement

Dans Railway, allez dans votre projet et cliquez "Variables" :

Ajoutez ces variables :

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
NODE_ENV=production
PORT=3000
```

Railway va redéployer automatiquement.

---

## Étape 6 : Pointer votre domaine vers Railway

1. Dans Railway, allez dans "Settings" > "Domains"
2. Cliquez "Add Domain"
3. Entrez `bubblehockey.be`
4. Railway vous donnera des instructions DNS

Chez votre registrar (OVH, Namecheap, etc.) :
1. Allez dans "DNS Settings"
2. Changez les nameservers vers ceux de Railway
   OU
   Créez un CNAME pointant vers Railway

---

## Étape 7 : Tester

1. Allez sur https://bubblehockey.be
2. Essayez de vous inscrire
3. Vérifiez que vous recevez un email

---

## Dépannage

**Le site ne se lance pas ?**
- Vérifiez les logs dans Railway
- Vérifiez que DATABASE_URL est correct
- Vérifiez que PORT=3000

**Les emails ne s'envoient pas ?**
- Vérifiez SENDGRID_API_KEY
- Vérifiez que l'email "from" est configuré dans SendGrid

**Le domaine ne pointe pas ?**
- Attendez 24-48h pour la propagation DNS
- Vérifiez les nameservers chez votre registrar

---

## Support

Pour toute question :
- Railway : https://railway.app/support
- Supabase : https://supabase.com/support
- SendGrid : https://sendgrid.com/support
