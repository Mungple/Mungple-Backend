import {useEffect, useState} from 'react';
import {ResponsePetProfile} from '@/types';

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();

  const yearsDiff = today.getFullYear() - birth.getFullYear();
  const monthsDiff = today.getMonth() - birth.getMonth();

  return yearsDiff * 12 + monthsDiff;
};

export const usePetAge = (petData: ResponsePetProfile[]) => {
  const [petDataWithAge, setPetDataWithAge] = useState<
    (ResponsePetProfile & {age: number})[]
  >([]);

  useEffect(() => {
    if (petData.length > 0) {
      const updatedPetData = petData.map(pet => ({
        ...pet,
        age: calculateAge(pet.birth),
      }));
      setPetDataWithAge(updatedPetData);
    }
  }, [petData]);

  return petDataWithAge;
};
