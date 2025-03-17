'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import { z } from 'zod';
import { Input } from '@heroui/react';
import LoadButton from '../ux/LoadButton';
import { useRegisterTeacher } from '@/hooks/useRegisterTeacher';
import { toast } from '@/hooks/use-toast';
import 'react-phone-input-2/lib/style.css';

const validationSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne doit pas dépasser 50 caractères" }),
  phone: z.string()
    .min(10, { message: "Le numéro de téléphone doit contenir au moins 10 chiffres" })
    .nullable(),
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La taille du fichier ne doit pas dépasser 5MB"
    })
    .refine((file) => !['image/gif'].includes(file.type), {
      message: "Les fichiers GIF ne sont pas acceptés"
    })
    .nullable()
});

export default function ProfRegister() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatarFile: null as File | null,
    previewUrl: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    file: '',
  });

  const registerMutation = useRegisterTeacher();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));
    setErrors(prev => ({ ...prev, name: '' }));
  };

  const handlePhoneChange = (phone: string) => {
    const phoneWithPrefix = '+' + phone;
    setFormData(prev => ({ ...prev, phone: phoneWithPrefix }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        validationSchema.shape.file.parse(file);
        if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
        const url = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          avatarFile: file,
          previewUrl: url
        }));
        setErrors(prev => ({ ...prev, file: '' }));
      } catch (err:any) {
        if (err instanceof z.ZodError) {
          setErrors(prev => ({ ...prev, file: err.errors[0].message }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      validationSchema.parse({
        name: formData.name,
        phone: formData.phone,
        file: formData.avatarFile
      });

      await registerMutation.mutateAsync({
        name: formData.name,
        email: '', // sera rempli dans la mutation
        phone: formData.phone,
        avatarFile: formData.avatarFile,
      }, {
        onSuccess: () => {
          toast({
            title: "Inscription réussie",
            description: "Votre profil a été créé avec succès",
          });
          router.push('/');
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error instanceof Error ? error.message : "Une erreur est survenue",
            variant: "destructive",
          });
        },
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {} as typeof errors;
        err.errors.forEach(error => {
          const field = error.path[0] as keyof typeof errors;
          newErrors[field] = error.message;
        });
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-2 md:py-4">
      <div className="w-full max-w-md border-2 border-transparent p-8 rounded-2xl">
        <h1 className="mb-8 text-center text-2xl font-bold">Complétez votre profil</h1>

        {registerMutation.isError && (
          <div className="mb-6 rounded-lg bg-red-100 p-3 text-red-700 text-sm">
            {registerMutation.error instanceof Error ? registerMutation.error.message : "Une erreur est survenue"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="block text-center text-sm">Photo de profil</label>
            <div className="flex flex-col items-center space-y-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-20 w-20 rounded-full border-2 border-[#1cb0ff] overflow-hidden group cursor-pointer hover:border-[#3dcaff] transition-all duration-200"
              >
                {formData.previewUrl ? (
                  <>
                    <Image
                      src={formData.previewUrl}
                      alt="Aperçu du profil"
                      className="rounded-full object-cover group-hover:opacity-50 transition-opacity duration-200"
                      fill
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 text-transparent group-hover:text-white text-xs text-center p-1">
                      Modifier
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-gray-400 text-xs text-center hover:bg-white/10 transition-all duration-200">
                    <span>Ajouter une photo</span>
                  </div>
                )}
              </div>
              <input title='image'
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              {errors.file && (
                <div className="text-red-500 break-words  text-sm mt-1">{errors.file}</div>
              )}
            </div>
          </div>

          <div className="relative">
    

            <Input
              required
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              description={"votre nom"}
              label=""
              labelPlacement={"outside"}
              placeholder="Votre Nom"
              type="text"
            />

            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div className="relative">
            <PhoneInput
              country={'tg'}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputClass="!w-full !bg-transparent !border !p-3 !pl-12 !border-gray-700 !rounded-md !outline-none hover:!border-[#1cb0ff] focus:!border-[#1cb0ff] !transition-all "
              containerClass="w-full"
              enableSearch
              preferredCountries={['tg', 'gh', 'ng', 'bj', 'ci', 'bf']}
              masks={{
                tg: '.. .. .. ..', gh: '... ... ....', ng: '... ... ....', bj: '.. .. .. ..', ci: '.. .. .. ..', bf: '.. .. .. ..',
              }}
              localization={{
                tg: 'Togo',
                gh: 'Ghana',
                ng: 'Nigeria',
                bj: 'Bénin',
                ci: 'Côte d\'Ivoire',
                bf: 'Burkina Faso',
              }}
            />
            {errors.phone && (
              <div className="text-red-500 break-words w-64 text-center mx-auto text-sm mt-1">{errors.phone}</div>
              )} 
          </div>

          <LoadButton 
            text="Continuer"
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          />

        </form>
      </div>
    </div>
  );
}