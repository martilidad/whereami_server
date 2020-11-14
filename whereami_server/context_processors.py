from whereami_server.version import GIT_SHA


def version(request):
    return {
        'version': GIT_SHA
    }