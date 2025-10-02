using Xplatform.Kafka;

namespace ImageOne278Consumer.ObserverService.Kafka;

public interface IKafkaSubscriber
{
    IKafkaConsumeMessageHelper InitiateKafkaConsumer();
}
