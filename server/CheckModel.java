import java.lang.reflect.Method;
public class CheckModel {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("dev.langchain4j.model.chat.ChatLanguageModel");
        for (Method m : clazz.getMethods()) {
            System.out.println(m.getName() + " -> " + m.getReturnType().getName());
            for (Class<?> param : m.getParameterTypes()) {
                System.out.println("  Param: " + param.getName());
            }
        }
    }
}
