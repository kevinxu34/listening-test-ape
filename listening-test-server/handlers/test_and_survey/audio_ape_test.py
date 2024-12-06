from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class ApeTestHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'apeTests'
        self.surveyCollectionName = 'apeSurveys'


class ApeSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'apeTests'
        self.surveyCollectionName = 'apeSurveys'
