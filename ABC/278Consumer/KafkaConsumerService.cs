using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics.CodeAnalysis;

namespace ImageOne278Consumer.ObserverService.Kafka;

[ExcludeFromCodeCoverage]
public class KafkaConsumerService : BackgroundService
{
    private readonly IEnumerable<IKafkaSubscriber> _kafkaSubscriber;

    public KafkaConsumerService(IServiceScopeFactory factory)
    {
        _kafkaSubscriber = factory.CreateScope().ServiceProvider.GetServices<IKafkaSubscriber>();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Parallel.ForEach(_kafkaSubscriber, subscriber =>
        {
            var kafkaConsumer = subscriber.InitiateKafkaConsumer();
            Task.Factory.StartNew(() => kafkaConsumer.ConsumeMessage());
        });

        return Task.CompletedTask;
    }
}
