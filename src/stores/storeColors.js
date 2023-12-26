import { defineStore } from 'pinia';
import { db, storage } from '@/js/firebase'; // Adjust the path as necessary
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useStoreColors = defineStore('storeColors', {
  state: () => ({
    selectedColor: '#ffffff',
    avatarImageUrl: '', // Initialize with an empty string or default URL
    backgroundImageUrl: '', // Initialize with an empty string or default URL

  }),
  actions: {
    async getAvatarUrl() {
      const avatarDocRef = doc(db, 'content', 'avatarUrl'); // Adjust with the correct path
      try {
        const avatarDoc = await getDoc(avatarDocRef);
        if (avatarDoc.exists()) {
          this.avatarImageUrl = avatarDoc.data().url; // Adjust 'url' based on your document field
        }
      } catch (error) {
        console.error('Error fetching avatar URL:', error);
      }
    },

    async updateAvatarImage(file) {
      if (!file) return;

      // Use a fixed reference for the avatar image in Firebase Storage
      const avatarRef = storageRef(storage, `avatars/avatar-image`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(avatarRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the avatar image URL in Firestore
        const avatarDocRef = doc(db, 'content', 'avatarUrl'); // Adjust with the correct path
        await setDoc(avatarDocRef, { url: downloadURL }, { merge: true });

        // Update the avatar image URL in your store
        this.avatarImageUrl = downloadURL;
      } catch (error) {
        console.error('Error uploading avatar image:', error);
      }
    },
  
  
    async getBackgroundUrl() {
      const backgroundDocRef = doc(db, 'content', 'backgroundUrl'); // Adjust with the correct path
      try {
        const backgroundDoc = await getDoc(backgroundDocRef);
        if (backgroundDoc.exists()) {
          this.backgroundImageUrl = backgroundDoc.data().url; // Adjust 'url' based on your document field
        }
      } catch (error) {
        console.error('Error fetching background URL:', error);
      }
    },

    async updateBackgroundImage(file) {
      if (!file) return;

      // Use a fixed reference for the background image in Firebase Storage
      const backgroundRef = storageRef(storage, `backgrounds/background-image`);

      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(backgroundRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the background image URL in Firestore
        const backgroundDocRef = doc(db, 'content', 'backgroundUrl'); // Adjust with the correct path
        await setDoc(backgroundDocRef, { url: downloadURL }, { merge: true });

        // Update the background image URL in your store
        this.backgroundImageUrl = downloadURL;
      } catch (error) {
        console.error('Error uploading background image:', error);
      }
    },

    
  }
});
