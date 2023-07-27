import { useEffect, useState, useRef } from 'react';

interface TypeWritterProps {
  text?: string[];
}

const textDataList = [
  'Full Stack Developer',
  'TypeScript/JavaScript Developer',
  'Web Development Enthusiast',
  'ReactJS/NodeJS Developer',
];

const textData: TypeWritterProps = {
  text: textDataList,
};

export default function Typewriter({ text }: TypeWritterProps = textData) {
  const [displayText, setDisplayText] = useState<string>('');
  const displayTextArray = useRef<string[]>(text ?? []);
  const arrayIndex = useRef<number>(0);
  const itemIndex = useRef<number>(0);
  const isReversed = useRef<boolean>(false);

  useEffect(() => {
    const typeWriterInterval = setInterval(() => {
      if (arrayIndex.current === displayTextArray.current.length) {
        arrayIndex.current = 0;
      }

      if (!isReversed.current) {
        if (
          itemIndex.current <
          displayTextArray.current[arrayIndex.current].length
        ) {
          setDisplayText(
            displayText +
              displayTextArray.current[arrayIndex.current][itemIndex.current]
          );
          itemIndex.current += 1;
        }
        if (
          itemIndex.current >=
          displayTextArray.current[arrayIndex.current].length
        ) {
          isReversed.current = true;
        }
        return;
      }

      if (isReversed.current) {
        if (itemIndex.current > 0) {
          setDisplayText((prevText) => prevText.slice(0, -1));
          itemIndex.current -= 1;
          return;
        }
        if (itemIndex.current <= 0) {
          isReversed.current = false;
          arrayIndex.current += 1;
        }
      }
    }, 100);

    return () => {
      clearInterval(typeWriterInterval);
    };
  }, [displayText]);

  return <div className="h-8">{displayText}</div>;
}

Typewriter.defaultProps = textData;
