import { useCallback, useState, useEffect } from 'preact/hooks';
import { getAuth } from 'firebase/auth';
import { buildCopyPrompt } from '../../libs/buildCopyPrompt';
import { autofillChatGPT } from './autofill-chatgpt';

import type { Prompt } from '../../common/interfaces/prompt';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from '../../config/firebase';

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = 'toast-message';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

export function usePrompt() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    getPromptsFromDB();
  }, [getAuth().currentUser]);

  const getPromptsFromDB = useCallback(async () => {
    const userId = getAuth().currentUser?.uid;

    if (!userId) {
      return [];
    }

    try {
      const q = query(
        collection(db, "prompts"),
        where("userId", "==", userId),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const userPrompts: Prompt[] = [];

      querySnapshot.forEach((doc) => {
        userPrompts.push({ id: doc.id, ...doc.data() } as Prompt);
      });

      setPrompts(userPrompts);
    } catch (e) {
      showToast('Error al obtener los prompts');
      console.error("Error getting documents: ", e);
      return [];
    }
  }, []);

  const createPrompt = useCallback(async (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const userId = getAuth().currentUser?.uid;

    if (!userId) {
      console.error("No user logged in");
      return;
    }

    try {
      await addDoc(collection(db, "prompts"), {
        ...data,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      showToast('Prompt guardado');

    } catch (error) {
      showToast('Error al crear el prompt');
      console.error("Error adding document: ", error);
    }
  }, [prompts, setPrompts]);

  const updatePrompt = useCallback(async (id: string, data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const promptIndex = prompts.findIndex(p => p.id === id);

    if (promptIndex === -1) {
      showToast('Prompt no encontrado');
      return;
    }

    try {
      const promptRef = doc(db, "prompts", id);
      await updateDoc(promptRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      showToast('Prompt actualizado');
    } catch (error) {
      showToast('Error al actualizar el prompt');
      console.error("Error updating document: ", error);
      return;
    }
  }, [prompts, setPrompts]);

  const getPrompt = useCallback((id: string) => prompts.find(p => p.id === id), [prompts]);

  const copyPrompt = useCallback((prompt: Prompt) => {
    const advancedPrompt = buildCopyPrompt(prompt);
    navigator.clipboard.writeText(advancedPrompt);
    showToast('Copiado al portapapeles');
  }, [prompts]);

  const autofillPrompt = useCallback(
    (prompt: Prompt, options?: { autoSend?: boolean; selector?: string }) => {
      const advancedPrompt = buildCopyPrompt(prompt);
      autofillChatGPT({
        value: advancedPrompt,
        autoSend: options?.autoSend ?? false,
        selector: options?.selector,
      });
      showToast('Prompt completado en ChatGPT');
    },
    [],
  );

  return { prompts, createPrompt, updatePrompt, getPrompt, copyPrompt, autofillPrompt };
}

