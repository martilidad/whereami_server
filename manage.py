#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from time import sleep


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'whereami_server.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    call_with_retry_on_db_error(execute_from_command_line)


def call_with_retry_on_db_error(execute_from_command_line):
    from django.db import OperationalError
    from django.conf import settings
    retry_num = 1
    executed_successfully = False
    while (not executed_successfully) and (retry_num <= settings.MAX_DB_CONNECTION_RETRIES):
        try:
            execute_from_command_line(sys.argv)
            executed_successfully = True

        except OperationalError as exc:
            if 'could not connect to server: Connection refused' in str(exc):
                print(
                    'DATABASE EXCEPTION: Database is not yet accepting connections. ',
                    'Sleeping for 1 second...',
                )
            elif 'the database system is starting up' in str(exc):
                print(
                    'DATABASE EXCEPTION: Database is starting up. ',
                    'Sleeping for 1 second...',
                )
            else:
                print('WARNING! Unhandled <django.db.utils.OperationalError>!')
                raise
            sleep(1)
            retry_num += 1
    if not executed_successfully:
        # Other errors would not be caught above
        print('Django was not able to connect to the database within ' + settings.MAX_DB_CONNECTION_RETRIES + ' retries')


if __name__ == '__main__':
    main()
