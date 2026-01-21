/**
 * Gallery Component
 * Fetches images from Firebase Firestore 'photos' collection
 * Displays in a responsive grid layout with loading states
 */

class Gallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.photos = [];
    this.isLoading = false;
    this.db = firebase.firestore();
    this.init();
  }

  async init() {
    this.renderLoadingState();
    await this.fetchPhotos();
    this.render();
  }

  renderLoadingState() {
    this.container.innerHTML = `
      <div class="gallery-loading">
        <div class="spinner"></div>
        <p>Loading your photos...</p>
      </div>
    `;
  }

  async fetchPhotos() {
    try {
      this.isLoading = true;
      const snapshot = await this.db.collection('photos').get();
      
      this.photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (this.photos.length === 0) {
        console.log('No photos found in collection');
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      this.renderError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  renderError(message) {
    this.container.innerHTML = `
      <div class="gallery-error">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading gallery: ${message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  render() {
    if (this.photos.length === 0) {
      this.container.innerHTML = `
        <div class="gallery-empty">
          <i class="fas fa-image"></i>
          <p>No photos yet. Upload some photos to get started!</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '';
    this.container.className = 'gallery-grid';

    this.photos.forEach(photo => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <div class="gallery-image-wrapper">
          <img 
            src="${photo.url}" 
            alt="${photo.title || 'Gallery photo'}"
            class="gallery-image"
            loading="lazy"
          />
          <div class="gallery-overlay">
            <button class="gallery-btn" onclick="gallery.viewPhoto('${photo.id}')">
              <i class="fas fa-expand"></i> View
            </button>
            <button class="gallery-btn" onclick="gallery.deletePhoto('${photo.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
        <div class="gallery-meta">
          <h3>${photo.title || 'Untitled'}</h3>
          <p class="gallery-date">${this.formatDate(photo.createdAt)}</p>
        </div>
      `;
      this.container.appendChild(item);
    });
  }

  formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  async deletePhoto(id) {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await this.db.collection('photos').doc(id).delete();
        this.photos = this.photos.filter(p => p.id !== id);
        this.render();
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('Failed to delete photo: ' + error.message);
      }
    }
  }

  viewPhoto(id) {
    const photo = this.photos.find(p => p.id === id);
    if (photo) {
      window.open(photo.url, '_blank');
    }
  }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.gallery = new Gallery('galleryGrid');
});
