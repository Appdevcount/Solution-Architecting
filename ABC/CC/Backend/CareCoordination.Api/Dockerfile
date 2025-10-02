FROM mcr.microsoft.com/dotnet/runtime:9.0 AS base

WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

ARG PAT
# RUN wget -qO- https://raw.githubusercontent.com/Microsoft/artifacts-credprovider/master/helpers/installcredprovider.sh | bash
# ENV NUGET_CREDENTIALPROVIDER_SESSIONTOKENCACHE_ENABLED true
ENV VSS_NUGET_EXTERNAL_FEED_ENDPOINTS "{\"endpointCredentials\":[{\"endpoint\":\"https://pkgs.dev.azure.com/eviCoreDev/_packaging/eviCoreVSTSNugetFeed/nuget/v3/index.json\", \"password\":\"${PAT}\"}]}"
  
COPY ["Carecoordination.Api/Carecoordination.Api.csproj", "Carecoordination.Api/"]
COPY ["Carecoordination.Domain/Carecoordination.Domain.csproj", "Carecoordination.Domain/"]
COPY ["Carecoordination.Application/Carecoordination.Application.csproj", "Carecoordination.Application/"]
COPY ["Carecoordination.Infrastructure/Carecoordination.Infrastructure.csproj", "Carecoordination.Infrastructure/"]

RUN dotnet restore -s "https://api.nuget.org/v3/index.json" -s "https://pkgs.dev.azure.com/eviCoreDev/_packaging/eviCoreVSTSNugetFeed/nuget/v3/index.json" "Carecoordination.Api/Carecoordination.Api.csproj"

COPY . .
WORKDIR "Carecoordination.Api"
RUN dotnet build "Carecoordination.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Carecoordination.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Carecoordination.Api.dll"]


