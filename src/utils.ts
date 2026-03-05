const delayTime = (time: number) => new Promise<void>((resolve: VoidFunction) => setTimeout(() => resolve(), time));

const generateId = () => `${Math.floor(Math.random() * 100000000)}`;
