# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base
COPY ImageOne278Consumer/ImageOne278Consumer.ObserverService/Certificates/innovate-lan-chain.pem /usr/local/share/ca-certificates/ca-cert.crt
COPY ImageOne278Consumer/ImageOne278Consumer.ObserverService/Certificates/ /app/KafkaCerts
RUN update-ca-certificates
WORKDIR /app


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ImageOne278Consumer/ImageOne278Consumer.ObserverService/ImageOne278Consumer.ObserverService.csproj", "ImageOne278Consumer/ImageOne278Consumer.ObserverService/"]
COPY ["ImageOne278Consumer/ImageOne278Consumer.Common/ImageOne278Consumer.Common.csproj", "ImageOne278Consumer/ImageOne278Consumer.Common/"]
COPY ["ImageOne278Consumer/ImageOne278Consumer.ExternalServices/ImageOne278Consumer.ExternalServices.csproj", "ImageOne278Consumer/ImageOne278Consumer.ExternalServices/"]
COPY ["ImageOne278Consumer/ImageOne278Consumer.ObserverService/NuGet.config", "ImageOne278Consumer/ImageOne278Consumer.ObserverService/"]

ARG PAT

RUN sed -i "s|</configuration>|<packageSourceCredentials><eviCoreVSTSNugetFeed><add key=\"Username\" value=\"PAT\" /><add key=\"ClearTextPassword\" value=\"${PAT}\" /></eviCoreVSTSNugetFeed></packageSourceCredentials></configuration>|" ImageOne278Consumer/ImageOne278Consumer.ObserverService/NuGet.config

RUN dotnet restore "ImageOne278Consumer/ImageOne278Consumer.ObserverService/ImageOne278Consumer.ObserverService.csproj" --configfile "ImageOne278Consumer/ImageOne278Consumer.ObserverService/NuGet.config"
RUN dotnet restore "ImageOne278Consumer/ImageOne278Consumer.Common/ImageOne278Consumer.Common.csproj" --configfile "ImageOne278Consumer/ImageOne278Consumer.ObserverService/NuGet.config"
RUN dotnet restore "ImageOne278Consumer/ImageOne278Consumer.ExternalServices/ImageOne278Consumer.ExternalServices.csproj" --configfile "ImageOne278Consumer/ImageOne278Consumer.ObserverService/NuGet.config"

COPY . .
WORKDIR "/src/ImageOne278Consumer/ImageOne278Consumer.ObserverService"
RUN dotnet build "ImageOne278Consumer.ObserverService.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ImageOne278Consumer.ObserverService.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ImageOne278Consumer.ObserverService.dll"]