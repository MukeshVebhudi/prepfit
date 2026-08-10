import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.util.Map;

public class Main {
    private static final int PORT = 8080;
    private static final String HOST = "localhost";
    private static final Path PROJECT_ROOT = findProjectRoot();
    private static final Map<String, String> CONTENT_TYPES = Map.of(
            "html", "text/html; charset=utf-8",
            "css", "text/css; charset=utf-8",
            "js", "application/javascript; charset=utf-8",
            "json", "application/json; charset=utf-8",
            "svg", "image/svg+xml",
            "png", "image/png",
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg"
    );

    public static void main(String[] args) throws IOException {
        int port = parsePort(args);
        InetSocketAddress address = new InetSocketAddress(InetAddress.getLoopbackAddress(), port);
        HttpServer server = HttpServer.create(address, 0);
        server.createContext("/", Main::handleRequest);
        server.start();

        System.out.printf("Meal planner running at http://%s:%d/%n", HOST, port);
        System.out.printf("Serving files from %s%n", PROJECT_ROOT);
        System.out.println("Press Ctrl+C to stop.");
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!"GET".equals(method) && !"HEAD".equals(method)) {
            exchange.getResponseHeaders().set("Allow", "GET, HEAD");
            sendText(exchange, 405, "Method not allowed");
            return;
        }

        Path file;
        try {
            file = requestedFile(exchange);
        } catch (InvalidPathException exception) {
            sendText(exchange, 400, "Bad request");
            return;
        }

        if (!isPublicFile(file)) {
            sendText(exchange, 404, "Not found");
            return;
        }

        exchange.getResponseHeaders().set("Content-Type", contentType(file));
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        send(exchange, 200, Files.readAllBytes(file));
    }

    private static Path requestedFile(HttpExchange exchange) {
        String path = exchange.getRequestURI().getPath();
        if (path == null || path.equals("/")) {
            return PROJECT_ROOT.resolve("index.html").normalize();
        }

        return PROJECT_ROOT.resolve(path.substring(1)).normalize();
    }

    private static String contentType(Path file) {
        String name = file.getFileName().toString();
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == name.length() - 1) {
            return "application/octet-stream";
        }

        String extension = name.substring(dotIndex + 1).toLowerCase();
        return CONTENT_TYPES.getOrDefault(extension, "application/octet-stream");
    }

    private static boolean isPublicFile(Path file) {
        if (!file.startsWith(PROJECT_ROOT) || !Files.isRegularFile(file)) {
            return false;
        }

        Path relativeFile = PROJECT_ROOT.relativize(file);
        if (relativeFile.getNameCount() == 1) {
            return CONTENT_TYPES.containsKey(extension(relativeFile));
        }

        String topLevelDir = relativeFile.getName(0).toString();
        return ("assets".equals(topLevelDir) || ".well-known".equals(topLevelDir))
                && CONTENT_TYPES.containsKey(extension(relativeFile));
    }

    private static String extension(Path file) {
        String name = file.getFileName().toString();
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == name.length() - 1) {
            return "";
        }

        return name.substring(dotIndex + 1).toLowerCase();
    }

    private static int parsePort(String[] args) {
        if (args.length == 0) {
            return PORT;
        }

        try {
            int port = Integer.parseInt(args[0]);
            if (port < 1 || port > 65535) {
                throw new IllegalArgumentException("Port must be between 1 and 65535.");
            }
            return port;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Port must be a number.", exception);
        }
    }

    private static Path findProjectRoot() {
        Path workingDirectory = Path.of("").toAbsolutePath().normalize();
        if (Files.exists(workingDirectory.resolve("index.html"))) {
            return workingDirectory;
        }

        try {
            Path classPath = Path.of(Main.class.getProtectionDomain()
                    .getCodeSource()
                    .getLocation()
                    .toURI()).toAbsolutePath().normalize();
            Path projectRoot = Files.isDirectory(classPath) ? classPath.getParent() : classPath.getParent().getParent();
            if (projectRoot != null && Files.exists(projectRoot.resolve("index.html"))) {
                return projectRoot;
            }
        } catch (NullPointerException | URISyntaxException exception) {
            // Fall through to the working directory error below.
        }

        throw new IllegalStateException("Could not find index.html. Run the app from the project root.");
    }

    private static void sendText(HttpExchange exchange, int statusCode, String text) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        send(exchange, statusCode, text.getBytes(StandardCharsets.UTF_8));
    }

    private static void send(HttpExchange exchange, int statusCode, byte[] body) throws IOException {
        boolean headRequest = "HEAD".equals(exchange.getRequestMethod());
        exchange.sendResponseHeaders(statusCode, headRequest ? -1 : body.length);
        try (OutputStream response = exchange.getResponseBody()) {
            if (!headRequest) {
                response.write(body);
            }
        }
    }
}
