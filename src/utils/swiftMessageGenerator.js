import { v4 as uuidv4 } from 'uuid';

export const generateSwiftMessage = (senderSwiftCode, receiverSwiftCode, messageType = 'MT103') => {
  // Remove any spaces and ensure uppercase
  const sender = (senderSwiftCode || '').replace(/\s/g, '').toUpperCase();
  const receiver = (receiverSwiftCode || '').replace(/\s/g, '').toUpperCase();
  
  // Generate a random transaction ID (similar to what SwiftGenerator.jar would do)
  const transactionId = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  
  // Generate a UUID for the message
  const messageUuid = uuidv4();
  
  // Create the SWIFT message blocks
  const block1 = `{1:F01${sender}XXXX${transactionId}}`;
  const block2 = `{2:I${messageType}${receiver}U}`;
  const block3 = `{3:{108:${sender}${transactionId}}{111:${messageType}}{121:${messageUuid}}}`;
  const block4 = '{4:';
  
  // Combine all blocks
  return `${block1}${block2}${block3}${block4}`;
}; 