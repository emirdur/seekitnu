import { createContext, useContext, useState } from "react";
import { IImageUpload } from "../../../shared/src/types/imageUpload";

const ImageUploadContext = createContext<IImageUpload>({
  hasUploadedImage: null,
  setHasUploadedImage: () => {},
  checkIfImageUploaded: async () => {},
});

export const ImageUploadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasUploadedImage, setHasUploadedImage] = useState<boolean | null>(
    null,
  );

  const checkIfImageUploaded = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/image`,
      );

      if (response.ok) {
        const data = await response.json();
        const uploaded = data.hasUploadedImage || false;
        setHasUploadedImage(uploaded);
      } else {
        setHasUploadedImage(false);
      }
    } catch (error) {
      setHasUploadedImage(false);
    }
  };

  return (
    <ImageUploadContext.Provider
      value={{ hasUploadedImage, setHasUploadedImage, checkIfImageUploaded }}
    >
      {children}
    </ImageUploadContext.Provider>
  );
};

// Custom hook to use the ImageUploadContext
export const useImageUpload = () => useContext(ImageUploadContext);
