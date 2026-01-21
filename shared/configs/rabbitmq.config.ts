export interface RabbitMQConfig {
  url: string;
}

export const loadRabbitMQConfig = (): RabbitMQConfig => {
  const url = process.env.RABBITMQ_URL;

  if (!url) {
    throw new Error('RABBITMQ_URL is not defined');
  }

  return { url };
};
