# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/ApeIskole.Api/ApeIskole.Api.csproj", "ApeIskole.Api/"]
COPY ["src/ApeIskole.Application/ApeIskole.Application.csproj", "ApeIskole.Application/"]
COPY ["src/ApeIskole.Domain/ApeIskole.Domain.csproj", "ApeIskole.Domain/"]
COPY ["src/ApeIskole.Infrastructure/ApeIskole.Infrastructure.csproj", "ApeIskole.Infrastructure/"]

RUN dotnet restore "./ApeIskole.Api/ApeIskole.Api.csproj"
COPY . .
WORKDIR "/src/src/ApeIskole.Api"
RUN dotnet build "./ApeIskole.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ApeIskole.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApeIskole.Api.dll"]
