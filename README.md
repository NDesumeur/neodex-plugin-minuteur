# Minuteur

Plusieurs minuteurs en même temps, chacun avec son nom, son anneau qui se vide et sa sonnerie. Ils gardent leur heure de fin : le décompte continue même si tu quittes l'onglet ou fermes NeoDex.

*English version: [README.en.md](README.en.md)*

## Créer un minuteur

1. Dans **Nouveau minuteur**, saisis les heures, minutes et secondes (jusqu'à 99 heures), ou clique sur une durée toute prête : 1, 3, 5, 10, 15, 25 ou 45 minutes, ou 1 heure.
2. Donne-lui un nom si tu veux (« Pâtes », « Pause »…) ; sans nom, il porte sa durée.
3. Clique sur **Ajouter le minuteur** : il démarre tout de suite.

## Utiliser les minuteurs

Chaque minuteur a sa carte, rangée dans **Mes minuteurs** :

- l'**anneau** se vide à mesure que le temps passe, avec le temps restant au centre ; la carte s'entoure de couleur quand il tourne ;
- **Pause** l'arrête, **Reprendre** repart d'où il en était ;
- **↺** le remet à zéro, sans le lancer ;
- **✕** le supprime.

## À la fin

Quand le temps est écoulé, trois bips retentissent, une notification « *nom* : terminé ! » s'affiche et la carte clignote. **Relancer** repart pour la même durée.

Si le Minuteur n'était pas affiché à ce moment-là, la carte apparaît terminée quand tu y reviens.

## Données et synchronisation

Tes minuteurs (nom, durée, temps restant, heure de fin) sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Minuteur → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
