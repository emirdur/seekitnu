import { createContext, useContext, useState } from "react";

// Update the interface to include setHasUploadedImage
interface IImageUpload {
  hasUploadedImage: boolean | null; // null for the loading state
  setHasUploadedImage: React.Dispatch<React.SetStateAction<boolean | null>>; // Function to update the state
  checkIfImageUploaded: (userId: string) => Promise<void>;
}

const ImageUploadContext = createContext<IImageUpload>({
  hasUploadedImage: null,
  setHasUploadedImage: () => {}, // No-op default function
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
        `http://localhost:5000/users/${userId}/image`,
      );
      const data = await response.json();
      const uploaded = response.ok && data.hasUploadedImage;
      setHasUploadedImage(uploaded);
    } catch (error) {
      console.error("Error checking image upload:", error);
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
