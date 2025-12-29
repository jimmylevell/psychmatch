import sys

class Logger:
    def __init__(self, filename, output=False):
        self.console = sys.stdout
        self.output = output
        self.file = None
        self.set_file(filename)

    def set_file(self, filename):
        if self.file:
            self.file.flush()
            self.file.close()
        self.file = open(filename, 'w')

    def write(self, message):
        if self.output:
            self.console.write(str(message) + '\n')
        if self.file:
            self.file.write(str(message) + '\n')

    def flush(self):
        self.console.flush()
        if self.file:
            self.file.flush()
