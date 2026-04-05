# Use official .NET runtime
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything
COPY . ./

# Restore dependencies
RUN dotnet restore

# Publish app
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/out ./

# Run app
ENTRYPOINT ["dotnet", "FitTrack.API.dll"]