import 'emoji-picker-element';

import { useRef , useEffect} from 'react';

export const EmojiPicker = ({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) => {
    const pickerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (pickerRef.current) {
            const handler = (event: Event) => {
                const customEvent = event as CustomEvent<{ emoji: { unicode: string } }>;
                if (customEvent.detail?.emoji?.unicode) {
                    onEmojiSelect(customEvent.detail.emoji.unicode);
                }
            };

            pickerRef.current.addEventListener('emoji-click', handler);

            return () => {
                pickerRef.current?.removeEventListener('emoji-click', handler);
            };
        }
    }, [onEmojiSelect]);

    return (
        // @ts-ignore - Tell TS to ignore custom element error
        <emoji-picker ref={pickerRef}></emoji-picker>
    );
};