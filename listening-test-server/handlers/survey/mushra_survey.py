from datetime import datetime

from bson import ObjectId
from handlers.base import BaseHandler


class MushraSurveyHandler(BaseHandler):

    async def get(self):
        _id = self.get_argument('_id')
        data = self.db['mushraTests'].find_one({'_id': ObjectId(_id)}, {'_id': 0, 'createdAt': 0, 'modifiedAt': 0})
        data['testId'] = ObjectId(_id)
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        body['createdAt'] = datetime.now()
        self.db['mushraSurveys'].insert_one(body)
