"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import type { LucideProps } from "lucide-react";
import { Folder } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

type LucideIconModule = typeof import("lucide-react");

const DynamicIcon: FC<DynamicIconProps> = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState<FC<LucideProps> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadIcon = async () => {
      try {
        // Dynamically import the entire library
        const lucide = await import("lucide-react");
        
        const FoundIcon = lucide[name as keyof LucideIconModule] as FC<LucideProps> | undefined;

        if (isMounted) {
          if (FoundIcon) {
            setIconComponent(() => FoundIcon); // Success: store the found icon
          } else {
            console.warn(`Ícone não encontrado: ${name}. Usando fallback.`);
            setIconComponent(() => Folder); // Error: icon not found, use fallback
          }
        }
      } catch (error) {
        console.error(`Erro ao carregar o ícone "${name}":`, error);
        if (isMounted) {
          setIconComponent(() => Folder); // Import error, use fallback
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [name]); 

  if (IconComponent) {
    return <IconComponent {...props} />;
  }

  return <Folder {...props} />;
};

export default DynamicIcon;
