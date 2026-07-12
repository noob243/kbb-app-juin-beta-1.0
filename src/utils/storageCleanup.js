/**
 * Nettoie les anciennes données du localStorage pour assurer la transition vers Firestore.
 */
export const cleanupOldStorage = () => {
  const keysToRemove = ['clients', 'appointments', 'kbb_data']; // Liste des clés que vous utilisiez
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Nettoyage du cache local : ${key} supprimé.`);
      localStorage.removeItem(key);
    }
  });

  // Optionnel : localStorage.clear(); // Pour tout supprimer d'un coup
};