import * as Didact from './Lib/didact/didact';

const blah: string[] = [];

export const App = () => {
  const b = {};
  const props = { ...b };
  console.log(props);

  return (
    <frame name="test" Points={['BOTTOM']}>
      {blah.map(v => (
        <font-string name="b" Text={v} />
      ))}
    </frame>
  );
};
