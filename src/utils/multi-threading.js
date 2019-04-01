const setHandler = (func, worker) => {
    const dataHandler = (event) => {
        func(event.data)
    }
    
    worker.onmessage(dataHandler);
};

export const Runner = (func, handler) => {
    const worker = new Worker(URL.createObjectURL(new Blob(['('+func+')()'])));
    setHandler(handler, worker);
    return worker;
};