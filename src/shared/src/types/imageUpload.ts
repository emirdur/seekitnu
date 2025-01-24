export interface IImageUpload {
  hasUploadedImage: boolean | null;
  setHasUploadedImage: React.Dispatch<React.SetStateAction<boolean | null>>;
  checkIfImageUploaded: (userId: string) => Promise<void>;
}
