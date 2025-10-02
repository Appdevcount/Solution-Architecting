using ImageOne278Consumer.Common.Constants;
using ImageOne278Consumer.Common.Models.Edi278Models;
using ImageOne278Consumer.ExternalServices.Interface;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;
using Xplatform.Kafka;

namespace ImageOne278Consumer.ObserverService.Kafka;

[ExcludeFromCodeCoverage]
public class Edi278KafkaSubscriber : IKafkaSubscriber
{
    private readonly IConfiguration _config;
    private readonly IApplicationLogger _logger;
    private readonly IKafkaProcessor<Edi278> _edi278Processor;

    public Edi278KafkaSubscriber(IApplicationLogger logger, IConfiguration config, IKafkaProcessor<Edi278> edi278Processor)
    {
        _config = config;
        _logger = logger;
        _edi278Processor = edi278Processor;
    }

    public IKafkaConsumeMessageHelper InitiateKafkaConsumer()
    {
        try
        {
            _logger.LogInformation($"{typeof(Edi278KafkaSubscriber).Name}: InitiateKafkaConsumer Started.");
            KafkaConfig config = new KafkaConfig(_config, ConfigSections.Edi278);
            return new KafkaConsumer<Edi278>(config, new Edi278(), _edi278Processor);
        }
        catch (Exception ex)
        {
            _logger.LogException($"{typeof(Edi278KafkaSubscriber).Name}: InitiateKafkaConsumer Error.", ex);
            throw;
        }
    }
}
