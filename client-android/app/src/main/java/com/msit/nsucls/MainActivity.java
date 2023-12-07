package com.msit.nsucls;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.method.LinkMovementMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.msit.nsucls.api.APIManagerSingleton;
import com.msit.nsucls.api.listeners.LoginListener;
import com.msit.nsucls.helpers.StorageHandler;
import com.msit.nsucls.helpers.Utils;

public class MainActivity extends AppCompatActivity {

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String userToken = StorageHandler.getDefaults("userToken", MainActivity.this);
        final String[] currActorType = {StorageHandler.getDefaults("actorType", MainActivity.this)};

        View login = findViewById(R.id.login_main);
        View dashboard = findViewById(R.id.dashboard_main);

        TextView link = findViewById(R.id.register_textview);
        link.setMovementMethod(LinkMovementMethod.getInstance());
        link.setOnClickListener(view -> {
            Uri uri = Uri.parse(Utils.frontendUrl + "/register"); // missing 'http://' will cause crashed
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        });

        TextView loginWithGoogle = findViewById(R.id.signInWithGoogleButton);
        loginWithGoogle.setOnClickListener(view -> {
            Uri uri = Uri.parse(Utils.frontendUrl + "/login"); // missing 'http://' will cause crashed
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        });

        EditText email = findViewById(R.id.email_login);
        EditText password = findViewById(R.id.password_login);
        Button signInButton = findViewById(R.id.signInButton);

        signInButton.setOnClickListener(view -> APIManagerSingleton.getApiManager(MainActivity.this).login(email.getText().toString(), password.getText().toString(), new LoginListener() {

            @Override
            public void onResponse(String userToken, String userSessionToken, String actorType) {
                StorageHandler.setDefaults("userToken", userToken, MainActivity.this);
                StorageHandler.setDefaults("userSessionToken", userSessionToken, MainActivity.this);
                StorageHandler.setDefaults("actorType", actorType, MainActivity.this);
                currActorType[0] = actorType;
                if (!currActorType[0].equals("Reviewer")) {
                    Button reviewerButton = findViewById(R.id.review_complaint_btn);
                    reviewerButton.setVisibility(View.GONE);
                }
                Toast.makeText(MainActivity.this, "Login Successful", Toast.LENGTH_LONG).show();
                login.setVisibility(View.GONE);
                dashboard.setVisibility(View.VISIBLE);
            }

            @Override
            public void onError(String e) {
                if (e == null) {
                    e = "Something went wrong";
                }
                Toast.makeText(MainActivity.this, e, Toast.LENGTH_LONG).show();
            }
        }));


        Button reviewerButton = findViewById(R.id.review_complaint_btn);
        Button myComplaintsButton = findViewById(R.id.my_complaint_button);
        Button lodgeComplaint = findViewById(R.id.lodge_complaint_button);
        Button logoutButton = findViewById(R.id.logout_btn);

        if (currActorType[0] != null && !currActorType[0].equals("Reviewer")) {
            reviewerButton = findViewById(R.id.review_complaint_btn);
            reviewerButton.setVisibility(View.GONE);
        }

        reviewerButton.setOnClickListener(view -> {
            Intent myComplaintsPage = new Intent(MainActivity.this, ReviewComplaints.class);
            startActivity(myComplaintsPage);
        });

        myComplaintsButton.setOnClickListener(view -> {
            Intent myComplaintsPage = new Intent(MainActivity.this, MyComplaints.class);
            startActivity(myComplaintsPage);
        });

        lodgeComplaint.setOnClickListener(view -> {
            Intent lodgeComplaintPage = new Intent(MainActivity.this, LodgeComplaint.class);
            startActivity(lodgeComplaintPage);
        });

        logoutButton.setOnClickListener(view -> {
            logout();
            dashboard.setVisibility(View.GONE);
            login.setVisibility(View.VISIBLE);
        });

        if (userToken == null) {
            StorageHandler.setDefaults("userToken", "YuXk56USER16502688259781736", MainActivity.this);
            StorageHandler.setDefaults("userSessionToken", "12Hz51UserSession1650268825979pd34", MainActivity.this);
            StorageHandler.setDefaults("actorType", "Reviewer", MainActivity.this);
            dashboard.setVisibility(View.GONE);
        } else {
            login.setVisibility(View.GONE);
        }
    }

    public void logout() {
        StorageHandler.removeDefault("userToken", MainActivity.this);
        StorageHandler.removeDefault("userSessionToken", MainActivity.this);
    }

}