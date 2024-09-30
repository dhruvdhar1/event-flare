import { PassThrough } from 'stream';
import { MessageDispatcher } from '../MessageDispatcher';
import { MessageTransformer } from '../MessageTransformer';

jest.mock('../MessageTransformer');

describe('MessageDispatcher', () => {
    let resMock
    let messageDispatcher
  
    beforeEach(() => {
      resMock = {
        pipe: jest.fn(),
        req: {},
        end: jest.fn(),
        write: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        emit: jest.fn(),
        setHeader: jest.fn(),
        writeHead: jest.fn(),
      }
      messageDispatcher = new MessageDispatcher(resMock);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should pipe readStream through MessageTransformer and into res', () => {
      const readStream = new PassThrough();
      const readStreamPipeSpy = jest.spyOn(readStream, 'pipe');

      const messageTransformerMock = new PassThrough();
      const messageTransformerPipeSpy = jest.spyOn(messageTransformerMock, 'pipe');

      MessageTransformer.mockImplementation(() => messageTransformerMock);
      messageDispatcher.sendMessage(readStream);
      expect(readStreamPipeSpy).toHaveBeenCalledWith(messageTransformerMock);
      expect(messageTransformerPipeSpy).toHaveBeenCalledWith(resMock);
    });
  
    it('should instantiate MessageTransformer with options when provided', () => {
      const options = { retryInterval: 1000 };
      const readStream = new PassThrough();
  
      messageDispatcher.sendMessage(readStream, options);
      expect(MessageTransformer).toHaveBeenCalledWith(options);
    });
  
    it('should instantiate MessageTransformer without options when not provided', () => {
      const readStream = new PassThrough();
  
      messageDispatcher.sendMessage(readStream);
      expect(MessageTransformer).toHaveBeenCalledWith(undefined);
    });
  });