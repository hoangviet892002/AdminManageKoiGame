export class LocalStorageService {
  static setRedirectUrlToLS(arg0: string) {
    throw new Error("Method not implemented.");
  }
  static removeProfileFromLS() {
    throw new Error("Method not implemented.");
  }
  // ...existing code...

  /**
   * Sets the redirect URL to local storage.
   * @param url The URL to be stored.
   */
  setRedirectUrlToLS(url: string): void {
    localStorage.setItem("redirectUrl", url);
  }

  /**
   * Removes the profile information from local storage.
   */
  removeProfileFromLS(): void {
    localStorage.removeItem("profile");
  }

  // ...existing code...
}
