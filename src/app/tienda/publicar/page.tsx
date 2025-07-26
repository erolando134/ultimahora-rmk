"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PublicarProducto() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 4 - imagenes.length);
    setImagenes((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Subir imágenes a Firebase Storage
      const urls: string[] = [];
      for (const file of imagenes) {
        const storageRef = ref(storage, `productos/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }

      // Guardar en Firestore
      await addDoc(collection(db, "productos"), {
        titulo,
        descripcion,
        precio,
        imagenes: urls,
        fechaPublicacion: Timestamp.now(),
        vendido: false,
      });

      toast({
        title: "¡Publicado correctamente!",
        description: "Tu artículo ha sido publicado en la tienda.",
      });

      router.push("/tienda/publicaciones");
    } catch (error: any) {
      console.error("Error al publicar:", error);
      toast({
        title: "Error al publicar",
        description: "Ocurrió un problema al subir tu publicación.",
        variant: "destructive",
      });
    }
  };

  const quitarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Publica tu artículo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Título del producto"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <Input
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <Input
          placeholder="Precio (Bs)"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <div>
          <p className="font-semibold">Sube hasta 4 imágenes:</p>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={imagenes.length >= 4}
          />
          <div className="flex gap-3 mt-2 flex-wrap">
            {imagenes.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => quitarImagen(index)}
                  className="absolute top-0 right-0 text-white bg-red-600 rounded-full px-1 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit">Subir Publicación</Button>
      </form>
    </div>
  );
}
