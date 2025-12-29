import json

class Score:
    def __init__(self, document_keyword=None, psychologist_keyword=None, score=0):
        self.document_keyword = document_keyword
        self.psychologist_keyword = psychologist_keyword
        self.score = score

    def toJSON(self):
        """Represent instance of a class as JSON.
        Arguments:
        obj -- any object
        Return:
        String that reprent JSON-encoded object.
        BASED ON: https://code-examples.net/en/q/23c26f
        """
        def serialize(obj):
            """Recursively walk object's hierarchy."""
            if isinstance(obj, (bool, int, float)):
                return obj
            elif isinstance(obj, dict):
                obj = obj.copy()
                for key in obj:
                    obj[key] = serialize(obj[key])
                return obj
            elif isinstance(obj, list):
                return [serialize(item) for item in obj]
            elif isinstance(obj, tuple):
                return tuple(serialize([item for item in obj]))
            elif hasattr(obj, '__dict__'):
                return serialize(obj.__dict__)
            else:
                return repr(obj)  # Don't know how to handle, convert to string
        return json.dumps(serialize(self))
